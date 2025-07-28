package com.example.service;

import org.kie.api.KieServices;
import org.kie.api.KieBase;
import org.kie.api.KieBaseConfiguration;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.builder.ReleaseId;
import org.kie.api.conf.EqualityBehaviorOption;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.io.Resource;
import org.kie.internal.io.ResourceFactory;
import org.kie.internal.builder.DecisionTableConfiguration;
import org.kie.internal.builder.DecisionTableInputType;
import org.kie.internal.builder.KnowledgeBuilderFactory;
import org.drools.decisiontable.DecisionTableProviderImpl;
import org.springframework.stereotype.Service;
import com.example.util.FileWatcher;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class DroolsService {
    private KieSession kieSession;
    private KieContainer kieContainer;
    private FileWatcher fileWatcher;
    // Single path - your file location
    private final String DECISION_TABLE_PATH = "src/main/resources/dtables/drools_decisiontable.drl.xlsx";

    @PostConstruct
    public void init() {
        loadDecisionTable();
        setupFileWatcher();
    }

    private void loadDecisionTable() {
        try {
            KieServices kieServices = KieServices.Factory.get();
            Resource dt = getDecisionTableResource();

            KieFileSystem kieFileSystem = kieServices.newKieFileSystem().write(dt);
            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();

            if (kieBuilder.getResults().hasMessages(org.kie.api.builder.Message.Level.ERROR)) {
                System.err.println("Errors building decision table: " + kieBuilder.getResults().toString());
                throw new RuntimeException("Failed to build decision table: " + kieBuilder.getResults().toString());
            }

            KieRepository kieRepository = kieServices.getRepository();
            ReleaseId krDefaultReleaseId = kieRepository.getDefaultReleaseId();

            if (kieSession != null) {
                kieSession.dispose();
            }
            if (kieContainer != null) {
                kieContainer.dispose();
            }

            kieContainer = kieServices.newKieContainer(krDefaultReleaseId);

            // Configure KieBase to use equality mode instead of identity mode
            KieBaseConfiguration kieBaseConfiguration = kieServices.newKieBaseConfiguration();
            kieBaseConfiguration.setOption(EqualityBehaviorOption.EQUALITY);

            KieBase kieBase = kieContainer.newKieBase(kieBaseConfiguration);
            kieSession = kieBase.newKieSession();

            System.out.println("Drools KieSession initialized/reloaded successfully with EQUALITY mode");
        } catch (Exception e) {
            System.err.println("Failed to initialize Drools KieSession: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Drools KieSession", e);
        }
    }

    private Resource getDecisionTableResource() throws IOException {
        // Try file system first (for development and hot reload)
        File decisionTableFile = new File(DECISION_TABLE_PATH);
        if (decisionTableFile.exists()) {
            FileInputStream fis = new FileInputStream(decisionTableFile);
            Resource dt = ResourceFactory.newInputStreamResource(fis);
            dt.setTargetPath("src/main/resources/dtables/drools_decisiontable.drl.xlsx");
            System.out.println("Loading from file system: " + decisionTableFile.getAbsolutePath());
            return dt;
        }

        // Fallback to classpath (embedded in JAR)
        System.out.println("Loading from classpath (JAR embedded)");
        return ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());
    }

    private void setupFileWatcher() {
        // Watch your decision table file for changes
        File fileToWatch = new File(DECISION_TABLE_PATH);

        if (fileToWatch.exists()) {
            System.out.println("Setting up hot reload for: " + fileToWatch.getAbsolutePath());

            fileWatcher = new FileWatcher(fileToWatch, () -> {
                try {
                    System.out.println("Excel file replaced, hot reloading decision table...");
                    loadDecisionTable();
                    System.out.println("Hot reload completed! New rules are now active.");
                } catch (Exception e) {
                    System.err.println("Hot reload failed: " + e.getMessage());
                    e.printStackTrace();
                }
            });
            fileWatcher.start();
        } else {
            System.out.println("No decision table file found for hot reload. Using embedded JAR version.");
            System.out.println("   Expected file: " + DECISION_TABLE_PATH);
        }
    }

    public KieSession getKieSession() {
        return kieSession;
    }

    public String getDrlRules() {
        if (kieSession == null) {
            throw new IllegalStateException("KieSession is not initialized");
        }

        try {
            Resource dt = getDecisionTableResource();

            DecisionTableProviderImpl decisionTableProvider = new DecisionTableProviderImpl();
            DecisionTableConfiguration dtConfig = KnowledgeBuilderFactory.newDecisionTableConfiguration();
            dtConfig.setInputType(DecisionTableInputType.XLSX);
            String drl = decisionTableProvider.loadFromResource(dt, dtConfig);
            System.out.println("=== CONVERTED DRL RULES FROM DECISION TABLE ===");
            System.out.println(drl);
            System.out.println("=== END OF DRL RULES ===");
            return drl;
        } catch (IOException e) {
            throw new RuntimeException("Failed to load decision table for DRL conversion", e);
        }
    }

    @PreDestroy
    public void cleanup() {
        if (fileWatcher != null) {
            fileWatcher.stop();
        }
        if (kieSession != null) {
            kieSession.dispose();
        }
        if (kieContainer != null) {
            kieContainer.dispose();
        }
    }
}
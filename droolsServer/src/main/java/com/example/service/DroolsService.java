package com.example.service;

import org.kie.api.KieServices;
import org.kie.api.builder.KieBuilder;
import org.kie.api.builder.KieFileSystem;
import org.kie.api.builder.KieRepository;
import org.kie.api.builder.ReleaseId;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.io.Resource;
import org.kie.internal.io.ResourceFactory;
import org.kie.internal.builder.DecisionTableConfiguration;
import org.kie.internal.builder.DecisionTableInputType;
import org.kie.internal.builder.KnowledgeBuilderFactory;
import org.drools.decisiontable.DecisionTableProviderImpl;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Service
public class DroolsService {
    private KieSession kieSession;
    private KieContainer kieContainer;
    private final String DECISION_TABLE_PATH = "src/main/resources/dtables/drools_decisiontable.drl.xlsx";

    @PostConstruct
    public void init() {
        loadDecisionTable();
    }

    private void loadDecisionTable() {
        try {
            KieServices kieServices = KieServices.Factory.get();

            File decisionTableFile = new File(DECISION_TABLE_PATH);
            Resource dt;

            if (decisionTableFile.exists()) {
                try {
                    FileInputStream fis = new FileInputStream(decisionTableFile);
                    dt = ResourceFactory.newInputStreamResource(fis);
                    
                    dt.setTargetPath("src/main/resources/dtables/drools_decisiontable.drl.xlsx");
                    System.out
                            .println("Loading decision table from file system: " + decisionTableFile.getAbsolutePath());
                } catch (IOException e) {
                    System.out.println("Failed to load from file system, falling back to classpath: " + e.getMessage());
                    dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());
                }
            } else {
                dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());
                System.out.println("Loading decision table from classpath (fallback)");
            }

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
            kieSession = kieContainer.newKieSession();
            System.out.println("Drools KieSession initialized/reloaded successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize Drools KieSession: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Drools KieSession", e);
        }
    }

    public void reloadDecisionTable() {
        System.out.println("🔄 Reloading decision table due to file changes...");
        loadDecisionTable();
        System.out.println("✅ Decision table reloaded successfully");
    }

    public KieSession getKieSession() {
        return kieSession;
    }

    public String getDrlRules() {
        if (kieSession == null) {
            throw new IllegalStateException("KieSession is not initialized");
        }


        File decisionTableFile = new File(DECISION_TABLE_PATH);
        Resource dt;

        if (decisionTableFile.exists()) {
            try {
                FileInputStream fis = new FileInputStream(decisionTableFile);
                dt = ResourceFactory.newInputStreamResource(fis);

                dt.setTargetPath("src/main/resources/dtables/drools_decisiontable.drl.xlsx");
            } catch (IOException e) {
                dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());
            }
        } else {
            dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());
        }

        DecisionTableProviderImpl decisionTableProvider = new DecisionTableProviderImpl();
        DecisionTableConfiguration dtConfig = KnowledgeBuilderFactory.newDecisionTableConfiguration();
        dtConfig.setInputType(DecisionTableInputType.XLSX);
        String drl = decisionTableProvider.loadFromResource(dt, dtConfig);
        System.out.println("=== CONVERTED DRL RULES FROM DECISION TABLE ===");
        System.out.println(drl);
        System.out.println("=== END OF DRL RULES ===");
        return drl;
    }

    @PreDestroy
    public void cleanup() {
        if (kieSession != null) {
            kieSession.dispose();
        }
        if (kieContainer != null) {
            kieContainer.dispose();
        }
    }
}
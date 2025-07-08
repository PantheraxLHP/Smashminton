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

@Service
public class DroolsService {
    private KieSession kieSession;

    @PostConstruct
    public void init() {
        try {
            KieServices kieServices = KieServices.Factory.get();
            Resource dt = ResourceFactory.newClassPathResource("dtables/drools_decisiontable.drl.xlsx", getClass());

            // Convert Excel decision table to DRL and print to console
            DecisionTableProviderImpl decisionTableProvider = new DecisionTableProviderImpl();
            DecisionTableConfiguration dtConfig = KnowledgeBuilderFactory.newDecisionTableConfiguration();
            dtConfig.setInputType(DecisionTableInputType.XLSX);
            String drl = decisionTableProvider.loadFromResource(dt, dtConfig);
            System.out.println("=== CONVERTED DRL RULES FROM DECISION TABLE ===");
            System.out.println(drl);
            System.out.println("=== END OF DRL RULES ===");

            KieFileSystem kieFileSystem = kieServices.newKieFileSystem().write(dt);
            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();
            KieRepository kieRepository = kieServices.getRepository();
            ReleaseId krDefaultReleaseId = kieRepository.getDefaultReleaseId();
            KieContainer kieContainer = kieServices.newKieContainer(krDefaultReleaseId);
            kieSession = kieContainer.newKieSession();
            System.out.println("Drools KieSession initialized successfully");
        } catch (Exception e) {
            System.err.println("Failed to initialize Drools KieSession: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to initialize Drools KieSession", e);
        }
    }

    public KieSession getKieSession() {
        return kieSession;
    }

    @PreDestroy
    public void cleanup() {
        if (kieSession != null) {
            kieSession.dispose();
        }
    }
}
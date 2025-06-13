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
            KieFileSystem kieFileSystem = kieServices.newKieFileSystem().write(dt);
            KieBuilder kieBuilder = kieServices.newKieBuilder(kieFileSystem);
            kieBuilder.buildAll();
            KieRepository kieRepository = kieServices.getRepository();
            ReleaseId krDefaultReleaseId = kieRepository.getDefaultReleaseId();
            KieContainer kieContainer = kieServices.newKieContainer(krDefaultReleaseId);
            kieSession = kieContainer.newKieSession();
        } catch (Exception e) {
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
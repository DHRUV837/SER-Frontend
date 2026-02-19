package org.example.salesincentivesystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SalesIncentiveSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalesIncentiveSystemApplication.class, args);
    }

}

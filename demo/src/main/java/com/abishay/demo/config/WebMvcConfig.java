package com.abishay.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from classpath:/static/
        // If a requested path is not an API path and does not map to a file, fallback to index.html (React SPA)
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        // If it's an API request, let it fall through to controllers
                        if (resourcePath.startsWith("dmo/") || resourcePath.startsWith("auth/") || resourcePath.startsWith("api/")) {
                            return null;
                        }
                        // Otherwise serve index.html for React SPA client routing
                        return location.createRelative("index.html");
                    }
                });
    }
}

package com.example.angularjs.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "file")
public class FileStorageProperties
{
    private String uploadDir = "upload-dir";

    public String getUploadDir()
    {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir)
    {
        this.uploadDir = uploadDir;
    }
}

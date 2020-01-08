package com.example.angularjs.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.concurrent.atomic.AtomicLong;

@ConfigurationProperties("storage")
public class StorageProperties
{
    private String location = "upload-dir";
    private static AtomicLong idImageCounter = new AtomicLong();
    private static AtomicLong idEventCounter = new AtomicLong();

    @Autowired
    public StorageProperties(DatabaseConfiguration configuration)
    {
        idImageCounter.set(configuration.getPictures().size() + 1);
        idEventCounter.set(configuration.getEvents().size() + 1);
    }

    public static long createImageId()
    {
        return idImageCounter.getAndIncrement();
    }

    public static long createEventId()
    {
        return idEventCounter.getAndIncrement();
    }

    public String getLocation()
    {
        return location;
    }

    public void setLocation(String location)
    {
        this.location = location;
    }

}

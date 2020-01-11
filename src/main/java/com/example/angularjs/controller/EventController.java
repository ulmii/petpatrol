package com.example.angularjs.controller;

import com.example.angularjs.configuration.DatabaseConfiguration;
import com.example.angularjs.configuration.StorageProperties;
import com.example.angularjs.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EventController
{
    private final DatabaseConfiguration configuration;

    @Autowired
    public EventController(DatabaseConfiguration configuration)
    {
        this.configuration = configuration;
    }

    @GetMapping("/getEventId")
    public Long getEventId()
    {
        return StorageProperties.createEventId();
    }

    @PostMapping("events")
    public void handleEvents(@RequestBody Event event)
    {
        configuration.getEvents().add(event);
    }

    @GetMapping("events/new")
    public List<Event> getNewEvents()
    {
        return configuration.getEvents().stream()
                .filter(event -> event.getStatus().equals(Event.Status.NEW))
                .collect(Collectors.toList());
    }

    @GetMapping("events/rejected")
    public List<Event> getRejectedEvents()
    {
        return configuration.getEvents().stream()
                .filter(event -> event.getStatus().equals(Event.Status.REJECTED))
                .collect(Collectors.toList());
    }

    @GetMapping("events/done")
    public List<Event> getDoneEvents()
    {
        return configuration.getEvents().stream()
                .filter(event -> event.getStatus().equals(Event.Status.DONE))
                .collect(Collectors.toList());
    }

    @GetMapping("users/{id}/events")
    public List<Event> getUserEvents(@PathVariable Long id)
    {
        return configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .flatMap(user -> user.getEvents().stream())
                .map(this::getEventById)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    @GetMapping("users/{id}/events/{eventId}/accept")
    public void acceptEvent(@PathVariable Long id, @PathVariable Long eventId)
    {
        configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .forEach(user -> user.getEvents().add(eventId));

        configuration.getEvents().stream()
                .filter(event -> event.getId().equals(eventId))
                .forEach(event -> event.setStatus(Event.Status.TAKEN));
    }

    @GetMapping("events")
    public List<Event> getEvents()
    {
        return configuration.getEvents();
    }

    private List<Event> getEventById(Long id)
    {
        return configuration.getEvents().stream()
                .filter(event -> event.getId().equals(id))
                .collect(Collectors.toList());
    }
}

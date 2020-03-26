package com.petpatrol.controller;

import com.petpatrol.configuration.DatabaseConfiguration;
import com.petpatrol.model.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserController
{
    private final DatabaseConfiguration configuration;

    @Autowired
    public UserController(DatabaseConfiguration configuration)
    {
        this.configuration = configuration;
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

    @PostMapping("users/{id}/events/{eventId}/accept")
    public void acceptEvent(@PathVariable Long id, @PathVariable Long eventId)
    {
        configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .forEach(user -> user.getEvents().add(eventId));

        configuration.getEvents().stream()
                .filter(event -> event.getId().equals(eventId))
                .forEach(event -> event.setStatus(Event.Status.TAKEN));
    }

    @PostMapping("users/{id}/events/{eventId}/reset")
    public void resetEvent(@PathVariable Long id, @PathVariable Long eventId)
    {
        configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .forEach(user -> user.getEvents().remove(eventId));

        configuration.getEvents().stream()
                .filter(event -> event.getId().equals(eventId))
                .forEach(event -> event.setStatus(Event.Status.NEW));
    }

    @PostMapping("users/{id}/events/{eventId}/reject")
    public void rejectEvent(@PathVariable Long id, @PathVariable Long eventId)
    {
        configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .forEach(user -> user.getEvents().remove(eventId));

        configuration.getEvents().stream()
                .filter(event -> event.getId().equals(eventId))
                .forEach(event -> event.setStatus(Event.Status.REJECTED));
    }

    @PostMapping("users/{id}/events/{eventId}/complete")
    public void completeEvent(@PathVariable Long id, @PathVariable Long eventId)
    {
        configuration.getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .forEach(user -> user.getEvents().remove(eventId));

        configuration.getEvents().stream()
                .filter(event -> event.getId().equals(eventId))
                .forEach(event -> event.setStatus(Event.Status.DONE));
    }

    private List<Event> getEventById(Long id)
    {
        return configuration.getEvents().stream()
                .filter(event -> event.getId().equals(id))
                .collect(Collectors.toList());
    }
}

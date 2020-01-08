package com.example.angularjs.service;

import com.example.angularjs.configuration.DatabaseConfiguration;
import com.example.angularjs.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService
{
    private DatabaseConfiguration configuration;

    @Autowired
    public UserService(DatabaseConfiguration configuration)
    {
        this.configuration = configuration;
    }

//    public User getUserByUserName(String name)
//    {
//        return configuration.getUsers().stream().filter(s -> s.equals(name)).findAny().get();
//    }
//
//    public List<User> all()
//    {
//        return configuration.getUsers();
//    }

}

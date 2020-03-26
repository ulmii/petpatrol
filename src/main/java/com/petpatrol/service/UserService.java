package com.petpatrol.service;

import com.petpatrol.configuration.DatabaseConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

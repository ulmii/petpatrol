package com.petpatrol.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Event
{
    public enum Status {
        NEW, REJECTED, DONE, TAKEN
    }

    private Long id;
    private String title;
    private String location;
    private String description;
    private String email;
    @Builder.Default
    private Status status = Status.NEW;
    private List<Picture> pictures;
}

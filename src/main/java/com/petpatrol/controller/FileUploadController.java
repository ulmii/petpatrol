package com.petpatrol.controller;

import com.petpatrol.configuration.DatabaseConfiguration;
import com.petpatrol.configuration.StorageProperties;
import com.petpatrol.exception.StorageFileNotFoundException;
import com.petpatrol.model.Picture;
import com.petpatrol.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class FileUploadController
{
    private final StorageService storageService;
    private final DatabaseConfiguration configuration;

    public FileUploadController(StorageService storageService, DatabaseConfiguration configuration)
    {
        this.storageService = storageService;
        this.configuration = configuration;
    }

    @GetMapping("/files")
    public List<Picture> listUploadedFiles() throws IOException
    {
        return configuration.getPictures();

        //        return storageService.loadAll().map(
        //                path -> MvcUriComponentsBuilder.fromMethodName(FileUploadController.class,
        //                        "serveFile", path.getFileName().toString()).build().toString())
        //                .collect(Collectors.toList());
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename)
    {
        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFilename() + "\"").body(file);
    }

    @PostMapping("/files")
    public Picture handleFileUpload(@RequestParam("file") MultipartFile file)
    {
        String fileName = storageService.store(file);
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/")
                .path(fileName)
                .toUriString();
        Picture picture = new Picture(StorageProperties.createImageId(), fileDownloadUri);
        configuration.getPictures().add(picture);

        return picture;
    }

    @PostMapping("/uploadMultipleFiles")
    public List<Picture> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files)
    {
        return Arrays.stream(files)
                .map(this::handleFileUpload)
                .collect(Collectors.toList());
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc)
    {
        return ResponseEntity.notFound().build();
    }
}

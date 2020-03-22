package my.nio;

import lombok.SneakyThrows;
import my.constant.Constants;
import org.testng.annotations.Test;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class LinkTest {

    @SneakyThrows
    @Test
    public void detectSymbolicLink() {
        Path path = Paths.get(Constants.BASE_DIRECTORY);
        try (final DirectoryStream<Path> paths = Files.newDirectoryStream(path, "*.md")) {
            for (Path file : paths) {
                System.out.print("file = " + file);
                System.out.println(Files.isSymbolicLink(file) ? "is symbolic link" : "");
            }
        }
    }

    @SneakyThrows
    @Test
    public void createHardLink() {
        Path newLink = Paths.get(Constants.BASE_DIRECTORY + "/heihei.md");
        Path targetLink = Paths.get(Constants.BASE_DIRECTORY + "/readme.md");
        Files.createLink(newLink, targetLink);
    }

    @SneakyThrows
    @Test
    public void createSymbolicLink() {
        Path newLink = Paths.get(Constants.BASE_DIRECTORY + "/heihei");
        Path targetLink = Paths.get(Constants.BASE_DIRECTORY + "/readme.md");
        Files.createSymbolicLink(newLink, targetLink);
    }
}

package my.iostream;

import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.*;

public class DirectoriesTest {

    @Test
    void listDirectoryWithGlobbing() {
        Path dir = Paths.get("");
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, "*.{java,class,md}")) {
            for (Path file : stream) {
                System.out.println(file.getFileName());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @Test
    void listDirectory() {
        Path dir = Paths.get("");
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
            for (Path file : stream) {
                System.out.println(file.getFileName());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void createDirectory() {
        Path dir = Paths.get("heihei");
        try {
            Files.createDirectory(dir);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Test
    void listDir() {
        for (Path name : FileSystems.getDefault().getRootDirectories()) {
            System.out.println(name);
        }
    }
}
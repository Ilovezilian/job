package my.iostream;

import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by Ilovezilian on 2017/11/18.
 */
public class FileOperation {
    @Test
    void createFile() {
        Path file = Paths.get("panshuai.md");
        try {
            Files.createFile(file);
        } catch (FileAlreadyExistsException x) {
            System.err.format("file named %s" +
                    " already exists%n", file);
        } catch (IOException x) {
            // Some other sort of failure, such as permissions.
            System.err.format("createFile error: %s%n", x);
        }
    }
    @Test
    void createTempFile() {
        try {
            Path tempFile = Files.createTempFile(null, ".myapp");
            System.out.format("The temporary file" +
                    " has been created: %s%n", tempFile)
            ;
        } catch (IOException x) {
            System.err.format("IOException: %s%n", x);
        }
    }

}

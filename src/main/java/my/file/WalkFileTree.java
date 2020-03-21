package my.file;

import lombok.SneakyThrows;
import my.constant.Constants;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class WalkFileTree {
    @SneakyThrows
    public static void main(String[] args) {
        Path path = Paths.get(Constants.BASE_DIRECTORY + "/heihei.md");
        try (final InputStream inputStream = Files.newInputStream(path)) {
            Thread.sleep(60L * 1000L);

        }
    }
}

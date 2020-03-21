package my.file;

import lombok.SneakyThrows;
import my.constant.Constants;
import org.testng.annotations.Test;

import java.nio.file.*;
import java.util.EnumSet;

import static java.nio.file.FileVisitOption.FOLLOW_LINKS;

public class WalkFileTreeTest {

    @SneakyThrows
    @Test
    public void walkFileTreeTest1() {
        Path dir = Paths.get(Constants.BASE_DIRECTORY);
        EnumSet<FileVisitOption> opts = EnumSet.of(FOLLOW_LINKS);
        Finder finder = new Finder("*.md");
        Files.walkFileTree(dir, opts, Integer.MAX_VALUE, finder);
    }

    @SneakyThrows
    @Test
    public void walkFileTreeTest() {
        Path dir = Paths.get(Constants.BASE_DIRECTORY);
        final FileVisitor<Path> visitor = new PrintFiles();
        Files.walkFileTree(dir, visitor);
    }

}
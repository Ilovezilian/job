package my.file;

import lombok.SneakyThrows;
import my.constant.Constants;
import org.testng.annotations.Test;

import java.io.IOException;
import java.nio.file.*;

public class DirectoryManTest {



    @SneakyThrows
    @Test
    public void filterDirectoryList() {
        System.out.println("filter with glob:");
        Path dir = Paths.get(Constants.BASE_DIRECTORY);
        try (DirectoryStream<Path> paths = Files.newDirectoryStream(dir, "*sxssf*.{xls,xlsx}")) {
            for (Path path : paths) {
                System.out.println("path = " + path.getFileName());
            }
        } catch (IOException e) {
            System.err.println(e);
        }

        System.out.println("\r\r\r");
        System.out.println("filter with myFilter:");
        DirectoryStream.Filter<Path> filter = file -> (Files.size(file) > 5120L); // 大于 5KB的文件
        try (final DirectoryStream<Path> paths = Files.newDirectoryStream(dir, filter)) {
            for (Path path : paths) {
                System.out.println("path = " + path.toString() + " size = " + Files.size(path));
            }

        }
    }

    @Test
    public void listDirectoryContentTest() {
        Path dir = Paths.get(Constants.BASE_DIRECTORY);
        try (DirectoryStream<Path> paths = Files.newDirectoryStream(dir)) {
            for (Path path : paths) {
                System.out.println("path = " + path.getFileName());
            }
        } catch (IOException e) {
//            e.printStackTrace();
            System.err.println(e);
        }

    }

    @Test
    public void showAllRootDirectoriesTest() {
        for (Path path : FileSystems.getDefault().getRootDirectories()) {
            System.out.println("path = " + path);
            /**
             * path = C:\
             * path = D:\
             * path = E:\
             */
        }
    }


    @SneakyThrows
    @Test
    public void createTempDirectoryTest() {
        Path path = Paths.get(Constants.TEMP_DIRECTORY);
        Files.createTempDirectory(path, "shuai");
    }

    @SneakyThrows
    @Test
    public void createDirectoryTest() {
        Path path = Paths.get(Constants.BASE_DIRECTORY + "/bar/foo/test");
        //        Path path = Paths.get( "bar/foo/test");
        //        Files.createDirectory(path);
        Files.createDirectories(path);
    }

}
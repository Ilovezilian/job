package my.file;

import java.io.IOException;
import java.nio.file.*;

public class DirectoryMan {
    public static void main(String[] args) throws IOException {
        Path path1 = Paths.get("d:\\tmp");
        Path path2 = Paths.get("d:\\tmp1");
        //        fileMoveCopyDelete(path1, path2);

        Path path3 = Paths.get("d:\\tmp1\\nicai.md");
        Path path4 = Paths.get("d:\\tmp1\\tmp.lnk");
        print(path2);
        print(path3);
        print(path4);
    }

    private static void print(Path path) {
        System.out.println("path = " + path);
        System.out.println(Files.isDirectory(path) ? "directory" : "not directory");
        System.out.println(Files.isRegularFile(path) ? "regular file" : "not regular file");
        System.out.println(Files.isSymbolicLink(path) ? "symbolic link" : "not symbolic link");
        System.out.println();
    }

    private static void fileMoveCopyDelete(Path path1, Path path2) throws IOException {
        /**
         * 不存在不等于 存在的反面，因为文件还可能会是一种unknown状态，就是不可获得状态
         * 所以不能简单相等
         */
        Files.exists(path1);
        Files.notExists(path1);

        //        fileCopy(path1, path2);
        //        java.nio.file.FileAlreadyExistsException: d:\tmp1
        //        Files.move(path1, path2);
        //         java.nio.file.DirectoryNotEmptyException: d:\tmp1  文件夹必须是空的
        Files.move(path1, path2, StandardCopyOption.REPLACE_EXISTING);

        //        Files.move(path2, path1);
        //        Files.delete(path2);
        //        Files.deleteIfExists(path2);
    }

    private static void fileCopy(Path path1, Path path2) throws IOException {
        // copy existing directory
        //        Files.copy(path1, path2);
        // copy empty directory
        Files.copy(path1, path2, StandardCopyOption.REPLACE_EXISTING);
    }
}

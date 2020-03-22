package my.nio;

import lombok.SneakyThrows;

import java.nio.file.FileStore;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.DosFileAttributes;
import java.nio.file.attribute.PosixFileAttributes;
import java.nio.file.attribute.PosixFilePermissions;

public class FileAttribute {
    @SneakyThrows
    public static void main(String[] args) {
        Path path1 = Paths.get("d:\\tmp");
        Path path2 = Paths.get("d:\\tmp1");
        //        fileMoveCopyDelete(path1, path2);

        Path path3 = Paths.get("d:\\tmp1\\nicai.md");
        Path path4 = Paths.get("d:\\tmp1\\tmp.lnk");
        printBasicAttrs(path1);
        printBasicAttrs(path3);

        printDOSAttrs(path1);
        printDOSAttrs(path3);
        //
        // 报错，因为这个不是Posix系统
        // printPOSIXAttrs(path1);
        // printPOSIXAttrs(path3);
        //         下面两个的输出是一样的，没太懂
        printSpace(path1);
        printSpace(path3);
    }

    @SneakyThrows
    private static void printSpace(Path path) {
        System.out.println("path = " + path);
        FileStore store = Files.getFileStore(path);
        System.out.println("totalSpace: " + ByteUnitEnum.getHumanSpace(store.getTotalSpace(), ByteUnitEnum.B));
        System.out.println("unallocatedSpace: " + ByteUnitEnum.getHumanSpace(store.getUnallocatedSpace(), ByteUnitEnum.B));
        System.out.println("usableSpace: " + ByteUnitEnum.getHumanSpace(store.getUsableSpace(), ByteUnitEnum.B));
    }


    @SneakyThrows
    private static void printPOSIXAttrs(Path path) {
        System.out.println("path = " + path);
        PosixFileAttributes attrs = Files.readAttributes(path, PosixFileAttributes.class);
        System.out.println("goup: " + attrs.group().getName());
        System.out.println("owner: " + attrs.owner().getName());
        System.out.println("permissions: " + PosixFilePermissions.toString(attrs.permissions()));
    }

    @SneakyThrows
    private static void printDOSAttrs(Path path) {
        System.out.println("path = " + path);
        DosFileAttributes attrs = Files.readAttributes(path, DosFileAttributes.class);
        System.out.println("isArchive: " + attrs.isArchive());
        System.out.println("isHidden: " + attrs.isHidden());
        System.out.println("isReadOnly: " + attrs.isReadOnly());
        System.out.println("isSystem: " + attrs.isSystem());
    }

    private static void printBasicAttrs(Path path) throws java.io.IOException {
        System.out.println("path = " + path);
        BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
        System.out.println("creationTime: " + attrs.creationTime());
        System.out.println("lastAccessTime: " + attrs.lastAccessTime());
        System.out.println("lastModifiedTime: " + attrs.lastModifiedTime());
        System.out.println("isRegularFile: " + attrs.isRegularFile());
        System.out.println("isSymbolicLink: " + attrs.isSymbolicLink());
        System.out.println("isDirectory: " + attrs.isDirectory());
        System.out.println("isOther: " + attrs.isOther());
        System.out.println("size: " + attrs.size());
    }
}

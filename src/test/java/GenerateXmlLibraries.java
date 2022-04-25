import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class GenerateXmlLibraries {
    private static StringBuffer myXml = new StringBuffer();
    final private static String PREFIX_FILENAME = "e:\\Kingdee\\";
    ;

    public static void main(String[] args) throws IOException {
        generateXml();
    }

    private static void generateXml() throws IOException {
        Path path = Paths.get(PREFIX_FILENAME + "eas\\server\\lib\\");
        generateContent(path);
        Path libraryOutputFile = Paths.get(PREFIX_FILENAME + "eas\\dev\\myGenerate_libraries.xml");
        if (Files.notExists(libraryOutputFile)) {
            Files.createFile(libraryOutputFile);
        }

        try (BufferedWriter bw = Files.newBufferedWriter(libraryOutputFile)) {
            bw.write(myXml.toString());
        }
    }

    private static void generateContent(Path path) throws IOException {
        myXml.append("<component name=\"libraryTable\">\n" +
                "  <library name=\"mine\">\n" +
                "    <CLASSES>\n");
        Files.walkFileTree(path.resolve("sp"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("patch"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("common"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("industry"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("server"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("client"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("addon"), new MyFileVisitOption("*.jar"));
        Files.walkFileTree(path.resolve("web"), new MyFileVisitOption("*.jar"));
        myXml.append("    </CLASSES>\n" +
                "    <JAVADOC />\n" +
                "    <SOURCES />\n" +
                "  </library>\n" +
                "</component>");
    }

    private static class MyFileVisitOption extends SimpleFileVisitor<Path> {

        private final PathMatcher matcher;

        MyFileVisitOption(String pattern) {
            matcher = FileSystems.getDefault().getPathMatcher("glob:" + pattern);
        }

        boolean find(Path file) {
            return matcher.matches(file.getFileName());
        }

        @Override
        public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
            if (attrs.isRegularFile() && find(file)) {
                myXml.append("      <root url=\"jar://").append(file.toAbsolutePath().toString().replace("D:\\EASCloud_shr", "$PROJECT_DIR$/../..").replaceAll("\\\\", "/")).append("!/\" />\n");
            }
            return FileVisitResult.CONTINUE;
        }
    }
}
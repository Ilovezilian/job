package my.numbersAndStrings;

/**
 * Created by Ilovezilian on 2017/8/27.
 */
public class FilenameDemo {
    public static void main(String[] args) {
        final String FPATH = "/home/user/index.html";
        Filename myHomePage = new Filename(FPATH, '/', '.');
        System.out.println("Extension = " + myHomePage.extension());
        System.out.println("Filename = " + myHomePage.filename());
        System.out.println("Path = " + myHomePage.path());

        FPATH.equalsIgnoreCase("haah");
        FPATH.contentEquals("hehe");
    }
}

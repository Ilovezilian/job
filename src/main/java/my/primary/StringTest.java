package my.primary;

public class StringTest {

    public static void main(String[] args) {
        replaceSpecialChar();
    }

    /**
     * 替换 \ 时，表达式需要要注意使用一个 \\\\ 替换 \ 。还是自己没有看仔细来的。
     */
    private static void replaceSpecialChar() {
        String s = "abcd".replaceAll("a", "b");
        System.out.println("s = " + s);
        String s1 = "ab\\\"cd".replaceAll("\\\\", "");
        System.out.println("s1 = " + s1);
    }
}

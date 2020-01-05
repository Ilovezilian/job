package my.fun;

public class RegularExpressionMatching {
    public static void main(String[] args) {
        System.out.println(new RegularExpressionMatching().isMatch("aa", "a"));
        System.out.println(new RegularExpressionMatching().isMatch("aa", "aa"));
        System.out.println(new RegularExpressionMatching().isMatch("aaa", "aa"));
        System.out.println(new RegularExpressionMatching().isMatch("aa", "a*"));
        System.out.println(new RegularExpressionMatching().isMatch("aa", ".*"));
        System.out.println(new RegularExpressionMatching().isMatch("ab", ".*"));
        System.out.println(new RegularExpressionMatching().isMatch("aab", "c*a*b"));
    }

    public boolean isMatch(String s, String p) {
        if (null != s) {
            return s.matches(p);
        }
        return false;
    }
}

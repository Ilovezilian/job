package my.fun;


import java.util.HashMap;
import java.util.Map;

public class LengthOfLongestSubstring {

    public static void main(String[] args) {
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("abcabcbb"));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("bbbbb"));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("pwwkew"));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("a"));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("aab"));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring(""));
        System.out.println(new LengthOfLongestSubstring().lengthOfLongestSubstring("bbtablud"));
    }

    public int lengthOfLongestSubstring(String s) {
        int ret = 0, lastIndex = 0;
        Map<Character, Integer> preMap = new HashMap<>(s.length());
        for (int i = 0; i < s.length(); ++i) {
            ret = getMax(ret, getMix(i - lastIndex + 1, i - preMap.getOrDefault(s.charAt(i), -1)));
            if (lastIndex <= preMap.getOrDefault(s.charAt(i), -1)) {
                lastIndex = preMap.getOrDefault(s.charAt(i), -1) + 1;
            }
            preMap.put(s.charAt(i), i);
        }
        return ret;
    }

    private int getMix(int a, int b) {
        return a < b ? a : b;
    }

    private int getMax(int a, int b) {
        return a > b ? a : b;
    }

    public int lengthOfLongestSubstring1(String s) {
        int ret = 1;
        for (int i = 0, temp = 1; i + 1 < s.length(); ++i) {
            if (s.charAt(i) != s.charAt(i + 1)) {
                ret = ret > ++temp ? ret : temp;
            } else {
                temp = 1;
            }
        }
        return ret;
    }
}

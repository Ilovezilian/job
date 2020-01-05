package my.generics;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class ErasesType {

    // Courts the number of occurrences of elem in anArray.
    public static <T> int count(T[] anArray, T elem) {
        int cnt = 0;
        for (T e : anArray) {
            if (e.equals(elem)) {
                ++cnt;
            }
        }
        return cnt;
    }
}

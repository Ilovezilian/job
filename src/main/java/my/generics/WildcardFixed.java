package my.generics;

import java.util.List;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class WildcardFixed {
    void foo(List<?> i) {
        fooHelper(i);
    }


    // Helper method created so that the wildcard can be captured
    // through type inference.
    private <T> void fooHelper(List<T> l) {
        l.set(0, l.get(0));
    }
}

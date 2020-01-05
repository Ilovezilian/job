package my.generics;

import java.util.List;

/**
 * Created by Ilovezilian on 2017/10/29.
 */
public class WildcardError {
    void foo(List<?> i) {
//        i.set(0, i.get(0));
        /**
         set
         (int,
         capture<?>)
         in List cannot be applied
         to
         (int,
         capture<?>)
         */
    }
}

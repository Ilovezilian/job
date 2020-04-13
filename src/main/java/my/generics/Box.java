package my.generics;

/**
 * Created by Ilovezilian on 2017/8/28.
 */

/**
 * Generic version of the Box class.
 *
 * @param <T> the type of the value being boxed
 */
public class Box<T> {
    // T stands for "Type"
    private T t;
    public static <T> T hello1() {
        System.out.println("t1 = empty");
        return null;
    }
    public static <T> T hello1(T t1) {
        System.out.println("t1 = " + t1);
        return t1;
    }

    public static <S> S hello(S t1) {
        System.out.println("t1 = " + t1);
        return t1;
    }

    public void set(T t) {
        this.t = t;
    }

    public T get() {
        return t;
    }

    // bounded type
    public <U extends Number> void inspect(U u) {
        System.out.println("T: " + t.getClass().getName());
        System.out.println("U: " + u.getClass().getName());
    }

    @Override
    public String toString() {
        return String.valueOf(t);
    }
}

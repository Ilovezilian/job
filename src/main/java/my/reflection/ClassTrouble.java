package my.reflection;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

class Cls {
    private Cls() {
    }
}

public class ClassTrouble {
    public static void main(String... args) {
        try {
            Constructor<Cls> constructor = Cls.class.getDeclaredConstructor();
            constructor.newInstance();
            Class<?> c = Class.forName("Cls");
//            c.newInstance();  // InstantiationException

            // production code should handle these exceptions more gracefully
        } catch (InstantiationException x) {
            x.printStackTrace();
        } catch (IllegalAccessException x) {
            x.printStackTrace();
        } catch (ClassNotFoundException x) {
            x.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }
}


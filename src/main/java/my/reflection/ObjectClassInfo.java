package my.reflection;


import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static my.reflection.e.A;

enum e {A, B}
;

public class ObjectClassInfo {

    public static void main(String[] args) throws ClassNotFoundException, NoSuchFieldException {
        Class c = A.getClass();
        System.out.println("c = " + c.getName());

        Set<String> s = new HashSet<String>();
        System.out.println("s = " + s.getClass());

//        error
//        boolean a;
//        System.out.println("a = " + a.class);
        System.out.println(boolean.class);

        System.out.println((int[][].class));

        Class cDoubleArray = Class.forName("[D");
        System.out.println("cDoubleArray = " + cDoubleArray);

        Class cStringArray = Class.forName("[[Ljava.lang.String;");
        System.out.println("cStringArray = " + cStringArray);


        Class StringClass = Class.forName("java.lang.String");
        System.out.println("StringClass = " + StringClass);

//        primitive class
        Class<Void> type = Void.TYPE;
        System.out.println("type = " + type);

        System.out.println(Arrays.toString(Character.class.getClasses()));

        System.out.println(Arrays.toString(Character.class.getDeclaredClasses()));

//####################################################################################################
//###fields
//####################################################################################################
        Field f = System.class.getField("out");
        System.out.println("f = " + f);
        System.out.println(f.getDeclaringClass());

        System.out.println(Thread.State.class.getEnclosingClass());;

        Class.forName("my.reflection.MyClass");
    }
}

package my.jvm;

import java.io.Serializable;

/**
 * @ClassName Overlaod
 * @Description TODO
 * @Author shuai.pan
 * @Date 2022-12-21 18:31
 * @Version 1.0
 */
public class Overlaod {

    static void sayHello(Object arg) {
        System.out.println("Hello, Object!");
    }

    static void sayHello(int arg) {
        System.out.println("Hello, int!");
    }

    static void sayHello(long arg) {
        System.out.println("Hello, long!");
    }

    static void sayHello(Character arg) {
        System.out.println("Hello, Character!");
    }


    static void sayHello(char arg) {
        System.out.println("Hello, char!");
    }

    static void sayHello(char... arg) {
        System.out.println("Hello, char...!");
    }

    static void sayHello(Serializable arg) {
        System.out.println("Hello, Serializable!");
    }

    static void sayHello(Comparable arg) {
        System.out.println("Hello, Character!");
    }

    public static void main(String[] args) {
        sayHello('a');
    }
}
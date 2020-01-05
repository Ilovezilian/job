package my.interfacesInheritance.implement;

/**
 * Created by Ilovezilian on 2017/8/2.
 */
public class Cat extends Animal {
    public static void testClassMethod() {
        System.out.println("this is static method in Cat");
    }
    public void testInstanceMethod() {
        System.out.println("this is instance method in Cat");
    }

    public static void main(String[] args) {
        Cat myCat = new Cat();
        Animal myAnimal = myCat;

        Animal.testClassMethod();
        myAnimal.testInstanceMethod();
    }
}

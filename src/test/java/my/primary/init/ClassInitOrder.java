package my.primary.init;

class App {
    public static void main(String[] args) {
        SubClass subClass = new SubClass();
        SubClass subClass1 = new SubClass();

        /**
         * 第一次初始化子类的顺序为：
         初始化父类的静态成员
         初始化父类的静态代码块
         初始化子类的静态成员
         初始化子类的静态代码块
         初始化父类的非静态成员
         初始化父类的非静态代码块
         初始化父类的构造方法
         初始化子类的非静态成员
         初始化子类的非静态代码块
         初始化子类的构造方法
         *
         * 输出:
         * 这是Member的构造方法，调用者是： Parent的静态成员
         * Parent的静态代码块
         * 这是Member的构造方法，调用者是： SubClass的静态成员
         * SbuClass的静态代码块
         * 这是Member的构造方法，调用者是： Parent的非静态成员
         * Parent的非静态代码块
         * Parent的构造方法
         * 这是Member的构造方法，调用者是： SubClass的非静态成员
         * SbuClass非静态码块
         * SubClass的无参数构造方法
         * 这是Member的构造方法，调用者是： Parent的非静态成员
         * Parent的非静态代码块
         * Parent的构造方法
         * 这是Member的构造方法，调用者是： SubClass的非静态成员
         * SbuClass非静态码块
         * SubClass的无参数构造方法
         */
    }
}

class Member {

    public Member(String str) {
        System.out.println("这是Member的构造方法，调用者是： " + str);
    }

}

class Parent {
    Member member = new Member("Parent的非静态成员");
    static Member smember = new Member("Parent的静态成员");

    static {
        System.out.println("Parent的静态代码块");
    }

    {
        System.out.println("Parent的非静态代码块");
    }

    public Parent() {
        System.out.println("Parent的构造方法");
    }
}

class SubClass extends Parent {
    Member member = new Member("SubClass的非静态成员");
    static Member smember = new Member("SubClass的静态成员");

    static {
        System.out.println("SbuClass的静态代码块");
    }

    {
        System.out.println("SbuClass非静态码块");
    }

    public SubClass() {
        System.out.println("SubClass的无参数构造方法");
    }
}



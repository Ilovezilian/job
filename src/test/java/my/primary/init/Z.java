package my.primary.init;

public class Z extends X {
    Y y = new Y();

    public Z() {
        System.out.println("Z");
        /**
         * 这个可以思考一下
         * 输出：
         * Y
         * X
         * Y
         * Z
         */
    }

    public static void main(String[] args) {
        new Z();
    }
}

class X {
    Y y = new Y();

    public X() {
        System.out.println("X");
    }
}

class Y {
    public Y() {
        System.out.println("Y");
    }
}


package my.jvm;

/**
 * @ClassName Dispatch
 * @Description 单分派、多分派演示
 * @Author shuai.pan
 * @Date 2022-12-21 19:50
 * @Version 1.0
 */
public class Dispatch {

    static class QQ {
    }

    static class QiHu360 {
    }

    static class Father {

        public void hardChoice(QQ qq) {
            System.out.println("Father choice QQ!");
        }

        public void hardChoice(QiHu360 qiHu360) {
            System.out.println("Father choice 360!");
        }
    }

    static class Son extends Father {

        @Override
        public void hardChoice(QQ qq) {
            System.out.println("Son choice QQ!");
        }

        @Override
        public void hardChoice(QiHu360 qiHu360) {
            System.out.println("Son choice 360!");
        }
    }

    public static void main(String[] args) {

        Father father = new Father();
        Father son = new Son();

        father.hardChoice(new QQ());
        son.hardChoice(new QiHu360());
        /**
         * Father choice QQ!
         * Son choice 360!
         */
    }
}
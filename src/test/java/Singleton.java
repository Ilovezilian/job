public class Singleton {
    // 双校验锁单例模式
    // volatile 防止指令重排
    private volatile static Singleton uniqueInstance;

    private Singleton() {

    }

    public static Singleton getUniqueInstance() {
        if (uniqueInstance == null) {
            synchronized (Singleton.class) {
                if (null == uniqueInstance) {
                    uniqueInstance = new Singleton();
                }
            }
        }
        return uniqueInstance;
    }
}

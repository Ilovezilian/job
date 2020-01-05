package my.interfacesInheritance.implement;

/**
 * Created by Ilovezilian on 2017/7/30.
 */
public class CharSequenceIml implements CharSequence {
    CharSequence charSequence;

    @Override
    public int length() {
        return charSequence.length();
    }

    @Override
    public char charAt(int index) {
        if (index < 0 || index >= charSequence.length()) {
            throw new IndexOutOfBoundsException("heihei");
        }
        return charSequence.charAt(index);
    }

    @Override
    public CharSequence subSequence(int start, int end) {
        return charSequence.subSequence(start, end);
    }
}

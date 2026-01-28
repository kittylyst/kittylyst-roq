package roq.kittylyst;

import io.quarkus.qute.TemplateExtension;

public final class Extensions {
    private Extensions() {}

    @TemplateExtension
    public static String doSomething(String text) {
        return text.replace("\n\n", "</p><p>&nbsp;</p><p>");
    }

}

package roq.kittylyst;

import io.quarkus.qute.Qute;

import java.util.Map;

public class QuteTest {

    public record Item(Map<String, String> data) {
    }

    public static void main(String[] args) {
        var template = """
    <div {#if item.data.hide??} class="hidden bk-hideable"{/if}><a href="{item.data.url}" target="_blank"><img src="{item.data.image}" width="328"/></a></div>
    <div {#if item.data.hide??} class="hidden bk-hideable"{/if}>
        <div>{item.data.isbn}</div>
        <div>&nbsp;</div>
        <div>{item.data.publisher} ({item.data.pubdate})</div>
    </div>
    <div {#if item.data.hide??} class="hidden bk-hideable"{/if}><p>{item.data.description}</p></div>
</div>
""";
        var keys = Map.of("title", "Optimizing Cloud Native Java 2nd Ed",
        "layout", "default",
        "isbn", "1098149343",
        "image", "images/books/ocnj2_cover.png",
        "pubdate", "2024-10-10",
        "publisher", "O'Reilly",
        "url", "https://www.amazon.com/Optimizing-Cloud-Native-Java-Application/dp/1098149343",
        "hide", "false",
                "description", """ 
Java Performance Analysis takes on a new dimension for cloud-based applications. Not only do engineers need to understand how to get the best single-JVM performance out of their applications, they increasingly need to know more about the clustered cloud environments those applications will run in.
</p><p>&nbsp;nbsp;</p><p>
Optimizing Cloud Native Java brings together a variety of practical techniques and performance methodologies. Deep dives on low-level aspects, such as Java Garbage Collection and code execution (including JIT compilation) are combined with chapters on observability and deployment tools. The end result is to to achieve quantitative and verifiable improvements in modern Java applications.
""");

        var data = new Item(keys);

        System.out.println(Qute.fmt(template, Map.of("item", data)));
    }

}

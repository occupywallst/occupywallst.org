---
layout: default
title: "The Good News"
lang: en
---

The game of life, is to keep the SF's score low. If you do something bad in
life, the SF gets at least two points. If you don't do something good that you
should have done, the SF gets at least one point. You never score, so the SF
always wins. ---Paul Erdős

<ol>
    {% for post in site.posts %}
      <li>
        <a href="{{ post.url }}">{{ post.title }}</a><br>
        <small>
          <span>{{ post.date | date:"%B %d, %Y" }}</span>
          with <a class="comlink" href="{{ post.url }}#disqus_thread">0
          Comments</a> thence.
        </small>
      </li>
    {% endfor %}
  </ol>
  <p>
    See thee in the streets.
</article>

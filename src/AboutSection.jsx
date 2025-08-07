import React from "react";
import "./AboutSection.css"; // Assuming you have a CSS file for styles

export default function AboutSection() {
  return (
    <>
     <section>
  <input className="sr-only" id="card-1" type="radio" name="panel" defaultChecked />
  <input className="sr-only" id="card-2" type="radio" name="panel" />
  <input className="sr-only" id="card-3" type="radio" name="panel" />

  <article id="article-1">
    <header>
      <h2>Gateway to Growth</h2>
      <label htmlFor="card-2">&#10539;</label>
    </header>
    <div>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSToP00j88zIQlU_HGq1_6jHmO6mUFpbpJHag&s" alt="watch tower" />
      <div className="poem">
        <p>
          A single spark ignites the path ahead,<br />
          A space for seeking where bold minds are led.<br />
          Questions bloom and ideas soar,<br />
          In this haven built to help you explore.
        </p>
        <p>
          From experts' wisdom quietly distilled,<br />
          To learners’ drive and dreams fulfilled.<br />
          Here, every answer lights a fuse,<br />
          And every insight shapes your views.
        </p>
        <p>
          Step in, discover, go beyond the known,<br />
          In every word, new seeds are sown.<br />
          Here futures form, curiosity is king,<br />
          And every ambition finds its spring.
        </p>
        <p>
          So begin your journey—pursue, connect, ignite,<br />
          Grow with us as day turns night.<br />
          A world of learning calls your name,<br />
          Unlock your future—join the game.
        </p>
      </div>
    </div>
  </article>

  <article id="article-2">
    <header>
      <h2>Insights Uncovered</h2>
      <label htmlFor="card-3">&#10539;</label>
    </header>
    <div>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqd7QDEfOkhOJdhlQ2T0JAvjia0jC0HAHpFTZK2TbRMKaoNd1a6EOWC78pCB1mUkdEgjY&usqp=CAU" alt="forest mist" />
      <div className="poem">
        <p>
          Here knowledge waits behind every door,<br />
          With articles, news, and breakthroughs galore.<br />
          Every topic, a path less walked,<br />
          Every story, a chance to talk.
        </p>
        <p>
          No gatekeeping here—just insights pure,<br />
          Shared and verified, helpful and sure.<br />
          Dive into worlds both vast and small,<br />
          Find the answers that help you stand tall.
        </p>
        <p>
          Curiosity’s spark in every line,<br />
          Real experiences, expertise refined.<br />
          An endless well of learning awaits,<br />
          For every seeker who participates.
        </p>
        <p>
          Come read, come search, let questions flow—<br />
          Where knowledge thrives and futures grow.<br />
          In every click, a chance to find<br />
          A brighter path, a sharper mind.
        </p>
      </div>
    </div>
  </article>

  <article id="article-3">
    <header>
      <h2>Unlikely Connections</h2>
      <label htmlFor="card-1">&#10539;</label>
    </header>
    <div>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAeuobdPWDHlUYp6qps_CO_V-vLQRwgVA4cg&s" alt="computer" />
      <div className="poem">
        <p>
          Once a coder, lost in the noise,<br />
          Found a mentor and shared their joys.<br />
          In a sea of voices, one reply,<br />
          Sparked a project, reaching high.
        </p>
        <p>
          Ideas once scattered, seeds in the wind,<br />
          Now planted, nurtured, working to blend.<br />
          What began as questions, timid and new,<br />
          Became collaborations that only grew.
        </p>
        <p>
          Celebrate difference—each mind unique,<br />
          Together, find the knowledge you seek.<br />
          Projects sprout where talents meet,<br />
          Transforming challenges into feat.
        </p>
        <p>
          Here, every journey starts with a chat,<br />
          A shared insight, a friendly pat.<br />
          So bring your hopes, your dreams to field,<br />
          Where open minds refuse to yield.
        </p>
      </div>
    </div>
  </article>
</section>
   </>
  );
}
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, useThemeUI } from "@theme-ui/core";
import * as React from "react";
import { useMutation, useQuery } from "react-query";
import { Formik } from "formik";

import "./App.css";

const defaultPassage =
  "In a decision dated June 28, 2004, an Immigration Judge denied the respondent’s applications for asylum and related relief and ordered her removed from the United States. 1 We dismissed the respondent’s appeal on October 27, 2005, and we denied her motion to reconsider our decision and reopen the proceedings on December 22, 2005. The respondent filed a second motion to reopen on November 12, 2019. The motion will be denied. The respondent is a native and citizen of the People’s Republic of China. In proceedings before the Immigration Judge, she conceded that she is removable, and she applied for relief from removal. The Immigration Judge found that the respondent’s testimony was not credible and, after advising her of the adverse consequences of knowingly filing a frivolous asylum application, determined that “material elements” of her claim were “deliberately fabricated,” as required for a frivolousness finding under 8 C.F.R. § 1208.20 (2004). The respondent’s first attorney who represented her at trial timely appealed that ruling, alleging as one of the four reasons for the appeal that the “Immigration Judge erred in finding the Respondent’s application to be frivolous as it was not fabricated.” The respondent’s second counsel prepared and filed the respondent’s appellate brief, which did not address the frivolous application finding. We dismissed the respondent’s appeal, and specifically affirmed the Immigration Judge’s determinations that she lacked credibility and submitted a frivolous application for asylum. A third counsel filed a petition for review of our decision, which the United States Court of Appeals for the Third Circuit denied on December 18, 2006. 3 Zhou v. Att’y Gen. of U.S., 206 F. App’x 237, 239 (3d Cir. 2006). Quoting the Immigration Judge’s finding that the respondent’s asylum application was frivolous, the court concluded that there was “no basis to reject the findings of either the [Immigration Judge] or the [Board].” Id.";
const defaultQuestions =
  "Where is the respondent from?\nWhat did the immigration judge find?\nWhat did the respondent's first attorney do?\nWhat did the respondent's second attorney do?\nWhich court of appeals?\nWhen was respondent's first appeal dismissed?";

const postQuestion = async (vars: { questions: string[]; passage: string }) => {
  const res = await fetch("https://bs.eoir.cc/socrates/mrc", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      passage: vars.passage,

      questions: vars.questions,
    }),
  });
  return res.json();
};

function App() {
  const [mutate, { isIdle, isLoading, isError, isSuccess, data, error }] = useMutation<
    { answers: { question: string; answer: string }[] },
    { error: string },
    {
      passage: string;
      questions: string[];
    }
  >(postQuestion);

  React.useEffect(() => {
    mutate({
      passage: defaultPassage,
      questions: defaultQuestions.split("\n").filter((item: any) => item !== ""),
    });
  }, []);

  async function handleSubmit(
    values: { passage: string; questions: string },
    actions: any
  ) {
    try {
      const questions = values.questions.split("\n").filter((item: any) => item !== "");
      await mutate({ passage: values.passage, questions });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Formik
      initialValues={{ passage: defaultPassage, questions: defaultQuestions }}
      onSubmit={handleSubmit}
    >
      {(props) => (
        <div
          sx={{
            minHeight: "100vh",
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <div sx={{ px: 3 }}>
            <h1>Magic LegalTech Computer</h1>
            <p>
              "Because reading case law is overrated." -{" "}
              <a href="https://twitter.com/edelman215">@Edelman215</a>
            </p>
          </div>
          <div sx={{ display: "flex", flexDirection: "column" }}>
            <div sx={{ flexGrow: 1 }}>
              <form onSubmit={props.handleSubmit}>
                <div sx={{ display: "flex", flexDirection: "column" }}>
                  <h2 sx={{ marginLeft: 3 }}>
                    Step 1: Supply Some Law You'd Rather Not Read
                  </h2>
                  <div
                    sx={{
                      my: 2,
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <textarea
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.passage}
                      name="passage"
                      sx={{ width: "95%", fontSize: "16px" }}
                      rows={10}
                    />
                  </div>
                  <h2 sx={{ marginLeft: 3 }}>
                    Step 2: Ask Some Questions (one per line)
                  </h2>

                  <div
                    sx={{
                      my: 2,
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <textarea
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.questions}
                      name="questions"
                      sx={{ width: "95%", fontSize: "16px" }}
                      rows={5}
                    />
                  </div>
                  <h2 sx={{ marginLeft: 3 }}>Step 3: Profit</h2>

                  <div
                    sx={{
                      my: 2,
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <button type="submit" sx={{ width: "95%" }}>
                      Submit
                    </button>
                  </div>
                </div>
              </form>
              <div></div>
              <div></div>
            </div>

            <div
              sx={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div sx={{ marginLeft: 3, display: "flex", flexDirection: "column" }}>
                {data?.answers?.map((item: any, index: any) => (
                  <div key={`pair-${index}`}>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
}

export default App;

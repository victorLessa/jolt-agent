import { ChatVertexAI } from "@langchain/google-vertexai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export default defineEventHandler(async (event) => {
  const { input, output } = await readBody(event);

  const model = new ChatVertexAI({
    model: "gemini-2.5-pro",
    temperature: 0
  });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Você é um especialista em Jolt Transform, uma linguagem de transformação de dados JSON. Sua tarefa é transformar o JSON de entrada no JSON de saída usando apenas Jolt Transform. O Retorno deve conter apenas o Jolt Transform sem explicações, formatação Markdown ou outros textos."],
    ["user", `Transforme o JSON:
    
      {input} 
    
      no JSON:
    
      {output}
    
      utilizando apenas o Jolt Transform.`],
  ]);

  const promptValue = await promptTemplate.invoke({
    input,
    output,
  });


  const response = await model.invoke(promptValue);
  return response.text;

})
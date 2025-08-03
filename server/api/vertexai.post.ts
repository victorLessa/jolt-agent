
import { generateText } from 'ai';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const { input, output } = await readBody(event);

  const result = await generateText({
    model: 'google/gemini-2.5-pro', // ou o modelo específico que desejar
    temperature: 0,
    system: `Você é um especialista em Jolt Transform, uma linguagem de transformação de dados JSON. Sua tarefa é transformar o JSON de entrada no JSON de saída usando apenas Jolt Transform. O Retorno deve conter apenas o Jolt Transform sem explicações, formatação Markdown ou outros textos.`,
    prompt: `Transforme o JSON:

      ${input}

      no JSON:

      ${output}

      utilizando apenas o Jolt Transform.`,
  });

  return result.text;
});
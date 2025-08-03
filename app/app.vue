<script setup lang="ts">
import Card from './components/ui/card/Card.vue';
import CardContent from './components/ui/card/CardContent.vue';
import CardHeader from './components/ui/card/CardHeader.vue';
import CardTitle from './components/ui/card/CardTitle.vue';
import js_beautify from 'js-beautify';
import Button from './components/ui/button/Button.vue';
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript';
import AlertDialog from './components/ui/alert-dialog/AlertDialog.vue';
import AlertDialogContent from './components/ui/alert-dialog/AlertDialogContent.vue';
import AlertDialogHeader from './components/ui/alert-dialog/AlertDialogHeader.vue';
import AlertDialogTitle from './components/ui/alert-dialog/AlertDialogTitle.vue';
import AlertDialogDescription from './components/ui/alert-dialog/AlertDialogDescription.vue';
import AlertDialogFooter from './components/ui/alert-dialog/AlertDialogFooter.vue';
import AlertDialogAction from './components/ui/alert-dialog/AlertDialogAction.vue';
import Label from './components/ui/label/Label.vue';
import Input from './components/ui/input/Input.vue';
import { Eye, EyeClosed, Loader2 } from 'lucide-vue-next';

const extensions = [javascript()]
const optionsJsBeautify = { indent_size: 2, space_in_empty_paren: false }
const outputJson = ref<string>('');
const inputJson = ref<string>('');
const joltJson = ref<string>('');
const typePassword = ref<'text' | 'password'>('password');
const isAuthenticated = ref(false);
const password = ref("");
const vertexIsBusy = ref(false)

const handleAuth = async () => {
  try {
    await $fetch('/api/auth', { method: "POST", body: { password: password.value } })
    isAuthenticated.value = true;

  } catch (error) {
    alert('Senha incorreta!');
  }
};

const toggleTypePassword = () => {
  typePassword.value = typePassword.value === 'password' ? 'text' : 'password';
};

const generateHandle = async () => {

  try {
    if (!outputJson.value || !inputJson.value) return;

    if (!isAuthenticated) return

    vertexIsBusy.value = true;

    const data = await $fetch('/api/vertexai', { method: "POST", body: { input: inputJson.value, output: outputJson.value } });

    joltJson.value = jsBeautifyInput(data || '');

  } catch (err) {

  } finally {
    vertexIsBusy.value = false;
  };
}

function jsBeautifyInput(value: string) {
  return js_beautify(value, optionsJsBeautify)
    .replace(/(^[ \t]*\n)/gm, ''); // remove linhas vazias
}

</script>

<template>
  <AlertDialog v-bind:open="!isAuthenticated">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Autenticação</AlertDialogTitle>
        <AlertDialogDescription>
          Autenticação necessária
        </AlertDialogDescription>
        <div class="flex items-center space-x-2">
          <div class="grid flex-1 gap-2">
            <Label for="password">
              Senha
            </Label>
            <div class="relative w-full items-center">
              <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
                <Eye v-if="typePassword == 'text'" @click="toggleTypePassword" class="size-6 text-muted-foreground" />
                <EyeClosed v-else @click="toggleTypePassword" class="size-6 text-muted-foreground" />
              </span>
              <Input id="password" v-model="password" :type="typePassword" placeholder="Senha" />
            </div>
          </div>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction @click="handleAuth" class="cursor-pointer">Confirmar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-[80vw] mx-auto px-4">
      <div class="flex flex-row gap-4">
        <Card class="flex-1 min-h-[350px]">
          <CardHeader>
            <div class="flex items-center justify-between w-full">
              <CardTitle>
                Adicione o JSON de entrada
              </CardTitle>
              <Button variant="outline" class="cursor-pointer" @click="inputJson = jsBeautifyInput(inputJson)">
                Formatar JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent class="h-full flex flex-col">
            <Codemirror v-model="inputJson" placeholder="Insira o JSON aqui" class="flex-1 h-full"
              style="width: 440px; overflow-x: auto;" :extensions="extensions" :autofocus="true" :indent-with-tab="true"
              :tab-size="2" />
          </CardContent>
        </Card>
        <Card class="flex-1 min-h-[350px]">
          <CardHeader>
            <div class="flex items-center justify-between w-full">
              <CardTitle>
                Adicione o JSON de saída
              </CardTitle>
              <Button variant="outline" class="cursor-pointer" @click="outputJson = jsBeautifyInput(outputJson)">
                Formatar JSON
              </Button>
            </div>
          </CardHeader>
          <CardContent class="h-full flex flex-col">
            <Codemirror v-model="outputJson" placeholder="Insira o JSON aqui" class="flex-1 h-full"
              style="width: 440px; overflow-x: auto;" :extensions="extensions" :indent-with-tab="true" :tab-size="2" />
          </CardContent>
        </Card>
        <Card class="flex-1 min-h-[350px]">
          <CardHeader>
            <div class="flex items-center justify-between w-full">
              <CardTitle>
                Jolt Transformation
              </CardTitle>
              <Button variant="outline" :disabled="vertexIsBusy" class="cursor-pointer" @click="generateHandle">
                <Loader2 v-if="vertexIsBusy" class="w-4 h-4 mr-2 animate-spin" />
                Transformar
              </Button>
            </div>
          </CardHeader>
          <CardContent class="h-full flex flex-col">
            <Codemirror v-model="joltJson" placeholder="Aqui você verá o JSON transformado" class="flex-1 h-full"
              style="width: 440px; overflow-x: auto;" :disabled="true" :extensions="extensions" :autofocus="true"
              :indent-with-tab="true" :tab-size="2" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

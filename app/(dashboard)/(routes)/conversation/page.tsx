'use client'

import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { Heading } from "@/components/heading";
import { formSchema } from "./constanst";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources";
import { useRouter } from "next/navigation";
import { Empty } from "@/components/empty";

const ConversationPage = () => {
  const route = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt
      };

      const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', {
        messages: newMessages
      });

      setMessages((current) => [...current, userMessage, response.data]);
    } catch (error) {
      console.log(error);
    } finally {
      route.refresh();
    }
  }

  return (
    <div>
      <Heading 
        title="Conversation"
        description="Chat with the smartest AI - Experience the power of AI"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
      />
      <div className="px-4 lg:px8">
        <div>
          <Form {...form} >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                control={form.control}
                disabled={isLoading}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        
                        placeholder="How do I calculate the radius of a circle?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {messages.length ===  0 && !isLoading && (
            <Empty label="There is no conversation started."/>
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div key={message.content?.toString()}>
                {message.content?.toString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConversationPage;
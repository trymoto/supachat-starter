"use client";

import React, { PropsWithChildren } from "react";
import { toast } from "./ui/use-toast";

type ErrorBoundaryProps = PropsWithChildren<{}>;

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  componentDidCatch(error: Error) {
    toast({
      title: "An error occurred",
      description: error.message,
      variant: "destructive",
    });
  }

  render() {
    return this.props.children;
  }
}

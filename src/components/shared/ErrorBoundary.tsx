import { Component } from 'react'
import type { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: { componentStack: string } | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="bg-background flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-destructive/10 text-destructive rounded-full p-4">
                <AlertTriangle className="h-12 w-12" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground">
                We're sorry for the inconvenience. An unexpected error has occurred.
              </p>
            </div>

            {this.state.error && (
              <details className="bg-muted rounded-lg p-4 text-left">
                <summary className="text-foreground cursor-pointer font-semibold">
                  Error details
                </summary>
                <div className="mt-3 space-y-2">
                  <div className="text-destructive font-mono text-sm break-words">
                    {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div className="text-muted-foreground max-h-40 overflow-auto font-mono text-xs">
                      {this.state.errorInfo.componentStack}
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload page
              </Button>
            </div>

            <p className="text-muted-foreground text-sm">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

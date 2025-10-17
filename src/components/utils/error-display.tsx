import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';


interface ErrorDisplayProps {
    title?: string;
    message?: string;
    type?: 'network' | 'server' | 'generic';
    onRetry?: () => void;
    showRetryButton?: boolean;
    className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    title = "Failed to Load Data",
    message = "We encountered an issue while loading your data. Please try again or contact support if the problem persists.",
    type = 'generic',
    onRetry,
    showRetryButton = true,
    className = ""
}) => {
    const getIcon = () => {
        switch (type) {
            case 'network':
                return <WifiOff className="h-12 w-12 text-muted-foreground" />;
            case 'server':
                return <AlertCircle className="h-12 w-12 text-destructive" />;
            default:
                return <AlertCircle className="h-12 w-12 text-muted-foreground" />;
        }
    };

    const getDefaultMessage = () => {
        switch (type) {
            case 'network':
                return "Unable to connect to the server. Please check your internet connection and try again.";
            case 'server':
                return "Server error occurred while processing your request. Our team has been notified.";
            default:
                return message;
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            {/* Error Icon */}
            <div className="mb-6 opacity-80">
                {getIcon()}
            </div>

            {/* Error Content */}
            <div className="text-center max-w-md space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {getDefaultMessage()}
                    </p>
                </div>

                {/* Alert Box for Additional Context */}
                <Alert className="border-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        {type === 'network' && "Connection issue detected"}
                        {type === 'server' && "Server temporarily unavailable"}
                        {type === 'generic' && "Data loading failed"}
                    </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                {showRetryButton && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                        <Button
                            onClick={onRetry}
                            variant="default"
                            size="sm"
                            className="min-w-[120px] cursor-pointer"
                            disabled={!onRetry}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="min-w-[120px] cursor-pointer"
                            onClick={() => window.location.reload()}
                        >
                            <Wifi className="h-4 w-4 mr-2" />
                            Refresh Page
                        </Button>
                    </div>
                )}
            </div>

            {/* Subtle Loading Animation for Retry */}
            <div className="mt-8 opacity-30">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;

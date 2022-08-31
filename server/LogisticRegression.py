import this
import numpy as np

class LogisticRegression:

    def __init__ (self, alpha, epochs):
        self.alpha = alpha
        self.epochs = epochs

    # compressing the values between 0 and 1
    def sigmoid (self, Z):
        return 1 / (1 + np.exp(-Z))
        
    # training the model
    def fit (self, X, Y):
        self.m = X.shape[0] # no of rows
        self.n = X.shape[1] # no of columns/features/dimensions
        self.W = np.zeros(self.n) # initializing weights as zeros
        self.b = 0 # initializing the bias as zero

        for i in range(self.epochs):
            Z = np.dot(X, self.W) + self.b # linear equation with weights and bias
            yHat = self.sigmoid(Z) # predicted value with current weight and bias

            dW = (1 / self.m) * np.dot(X.T, (yHat - Y)) # derivative wrt weights
            db = (1 / self.m) * np.sum(yHat - Y) # derivative wrt bias

            # updating parameters
            self.W = self.W - self.alpha * dW
            self.b = self.b - self.alpha * db

    # predicting the outcome
    def predict(self, X):
        Z = np.dot(X, self.W) + self.b
        yHat = self.sigmoid(Z)

        yHatFinal = [1 if i > 0.5 else 0 for i in yHat] # splitting classes based on decision boundary

        return yHatFinal
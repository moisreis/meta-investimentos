export const ID = {
  USER: {
    DEFAULT: "0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d",
    OTHER: "1b2c3d4e-5f6a-4b7c-9d8e-0f1a2b3c4d5e",
  },
  ACCOUNT: {
    DEFAULT: "a1b2c3d4-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
    OTHER: "b2c3d4e5-6f7a-4b8c-9d0e-1f2a3b4c5d6e",
    THIRD: "c3d4e5f6-7a8b-4c9d-8e0f-1a2b3c4d5e6f",
  },
  SESSION: {
    DEFAULT: "c3d4e5f6-7a8b-4c9d-8e0f-1a2b3c4d5e6f",
    OTHER: "d4e5f6a7-8b9c-4d0e-9f1a-2b3c4d5e6f7a",
    THIRD: "e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b",
  },
  VERIFICATION: {
    DEFAULT: "e5f6a7b8-9c0d-4e1f-8a2b-3c4d5e6f7a8b",
    OTHER: "f6a7b8c9-0d1e-4f2a-9b3c-4d5e6f7a8b9c",
    SECOND: "7a8b9c0d-1e2f-4a3b-9c4d-5e6f7a8b9c0d",
  },
  BANK: {
    DEFAULT: "2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
    OTHER: "3d4e5f6a-7b8c-4d9e-8f0a-1b2c3d4e5f6a",
  },
  BANK_ACCOUNT: {
    DEFAULT: "12345678-90ab-4cde-f012-3456789abcde",
    OTHER: "23456789-0abc-4def-a123-456789abcdef",
    THIRD: "3456789a-bc0d-4efa-b234-56789abcde0f",
  },
  CHECKING_ACCOUNT: {
    DEFAULT: "456789ab-cd0e-4fab-c345-6789abcde0f1",
    OTHER: "56789abc-de0f-4abc-d456-789abcde0f12",
    EXTERNAL: "6789abcd-ef0a-4bcd-e567-89abcde0f123",
    PERIOD_OUTSIDE: "789abcde-f0ab-4cd1-9f67-8abcde012345",
  },
  BENCHMARK: {
    DEFAULT: "4e5f6a7b-8c9d-4e0f-8a1b-2c3d4e5f6a7b",
    OTHER: "5f6a7b8c-9d0e-4f1a-9b2c-3d4e5f6a7b8c",
  },
  BENCHMARK_HISTORY: {
    DEFAULT: "89012abc-def0-4afe-9012-3abcdef0123a",
    OTHER: "9a01bcde-f012-4afe-1234-bcdef01234ab",
    EXTERNAL: "ab01cdef-0123-4afe-3456-cdef012345ab",
    PERIOD_OUTSIDE: "bc12def0-1234-4afe-5678-def0123456bc",
  },
  CATEGORY: {
    DEFAULT: "6a7b8c9d-0e1f-4a2b-9c3d-4e5f6a7b8c9d",
    OTHER: "7b8c9d0e-1f2a-4b3c-8d4e-5f6a7b8c9d0e",
  },
  FUND: {
    DEFAULT: "8c9d0e1f-2a3b-4c4d-9e5f-6a7b8c9d0e1f",
    OTHER: "9d0e1f2a-3b4c-4d5e-8f6a-7b8c9d0e1f2a",
  },
  QUOTA: {
    DEFAULT: "cd12ef01-2345-4afe-6789-01abcdef0123",
    OTHER: "de23f012-3456-4afe-789a-12bcdef01234",
    EXTERNAL: "ef34f012-3456-4afe-89ab-23cdef012345",
    PERIOD_OUTSIDE: "f045f123-4567-4afe-9abc-34def0123456",
  },
  PORTFOLIO: {
    DEFAULT: "0e1f2a3b-4c5d-4e6f-9a7b-8c9d0e1f2a3b",
    OTHER: "1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c",
    THIRD: "123e4567-e89b-4d3c-a456-426614174000",
  },
  NORM: {
    DEFAULT: "3e3f4051-6a7b-4c8d-9e0f-1a2b3c4d5e6f",
    OTHER: "4f405162-7b8c-4d9e-8f0a-2b3c4d5e6f70",
  },
  POSITION: {
    DEFAULT: "2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d",
    OTHER: "3b4c5d6e-7f8a-4b9c-8d0e-1f2a3b4c5d6e",
    THIRD: "10a1b2c3-4d5e-4f6a-8b7c-9d0e1f2a3b4c",
  },
  APPLICATION: {
    DEFAULT: "4c5d6e7f-8a9b-4c0d-9e1f-2a3b4c5d6e7f",
    OTHER: "5d6e7f8a-9b0c-4d1e-8f2a-3b4c5d6e7f8a",
    EXTERNAL: "5e5f6071-8a9b-4c0d-9e1f-2a3b4c5d6e7f",
    PERIOD_OUTSIDE: "6f607182-9a0b-4d1e-8f2a-3b4c5d6e7f80",
  },
  WITHDRAWAL: {
    DEFAULT: "6e7f8a9b-0c1d-4e2f-9a3b-4c5d6e7f8a9b",
    OTHER: "7f8a9b0c-1d2e-4f3a-8b4c-5d6e7f8a9b0c",
    EXTERNAL: "708192a3-bc0d-4e2f-9a3b-4c5d6e7f8091",
    PERIOD_OUTSIDE: "8192a3b4-cd0e-4f3a-8b4c-5d6e7f8091a2",
  },
  TRANSACTION_ALLOCATION: {
    DEFAULT: "92a3b4c5-de0f-4a3b-9c4d-5e6f708192a3",
    OTHER: "03b4c5d6-ef0a-4b3c-8d4e-6f708192a3b4",
    SECOND: "14c5d6e7-f0ab-4c3d-9e4f-708192a3b4c5",
  },
  POSITION_PERFORMANCE: {
    DEFAULT: "9a90a1b2-cd0e-4f3a-9b4c-5d6e7f8091a2",
    OTHER: "0b0b1c2d-de0f-4a4b-8c5d-6e7f8091a2b3",
    EXTERNAL: "1c1c2d3e-ef0a-4b5c-9d6e-7f8091a2b3c4",
    PERIOD_OUTSIDE: "2d2d3e4f-f0ab-4c6d-8e7f-8091a2b3c4d5",
  },
  PORTFOLIO_PERFORMANCE: {
    DEFAULT: "5c5d6e7f-8a9b-4c0d-9e1f-2a3b4c5d6e7f",
    OTHER: "6d6e7f80-9a0b-4d1e-8f2a-3b4c5d6e7f80",
    EXTERNAL: "7e7f8091-ab0c-4e2f-8a3b-4c5d6e7f8091",
    PERIOD_OUTSIDE: "8f8091a2-bc0d-4f3a-9b4c-5d6e7f8091a2",
  },
  STATEMENT: {
    DEFAULT: "25e6f708-1a2b-4c0d-9e1f-2a3b4c5d6e7f",
    OTHER: "36f70819-2b3c-4d1e-8f2a-3b4c5d6e7f80",
    THIRD: "4708192a-3c4d-4e2f-9a3b-4c5d6e7f8091",
  },
  AUDIT_LOG: {
    DEFAULT: "52a9b0c1-4d5e-4f6a-8b7c-9d0e1f2a3b4c",
    OTHER: "63b0c1d2-5e6f-4a7b-9c8d-0e1f2a3b4c5d",
  },
} as const;

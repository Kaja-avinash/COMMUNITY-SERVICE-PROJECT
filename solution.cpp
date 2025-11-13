#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int N;
vector<string> faces[6];

void rotate_clockwise(vector<string> &face)
{
    int n = face.size();
    vector<string> newf(n, string(n, ' '));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            newf[j][n - 1 - i] = face[i][j];
    face = newf;
}

void rotate_counterclockwise(vector<string> &face)
{
    int n = face.size();
    vector<string> newf(n, string(n, ' '));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            newf[n - 1 - j][i] = face[i][j];
    face = newf;
}

void turn_left()
{
    auto temp = faces[3];
    faces[3] = faces[4];
    faces[4] = faces[1];
    faces[1] = faces[5];
    faces[5] = temp;
    rotate_clockwise(faces[2]);
    rotate_counterclockwise(faces[0]);
}

void turn_right()
{
    auto temp = faces[3];
    faces[3] = faces[5];
    faces[5] = faces[1];
    faces[1] = faces[4];
    faces[4] = temp;
    rotate_counterclockwise(faces[2]);
    rotate_clockwise(faces[0]);
}

void rotate_front()
{
    auto temp = faces[3];
    faces[3] = faces[0];
    faces[0] = faces[1];
    faces[1] = faces[2];
    faces[2] = temp;
    rotate_clockwise(faces[4]);
    rotate_counterclockwise(faces[5]);
}

void rotate_back()
{
    auto temp = faces[3];
    faces[3] = faces[2];
    faces[2] = faces[1];
    faces[1] = faces[0];
    faces[0] = temp;
    rotate_counterclockwise(faces[4]);
    rotate_clockwise(faces[5]);
}

void rotate_left()
{
    auto temp = faces[2];
    faces[2] = faces[4];
    faces[4] = faces[0];
    faces[0] = faces[5];
    faces[5] = temp;
    rotate_counterclockwise(faces[3]);
    rotate_clockwise(faces[1]);
}

void rotate_right()
{
    auto temp = faces[2];
    faces[2] = faces[5];
    faces[5] = faces[0];
    faces[0] = faces[4];
    faces[4] = temp;
    rotate_clockwise(faces[3]);
    rotate_counterclockwise(faces[1]);
}

void rotate_layer(int side, bool is_row, int idx, bool left_up)
{
    if (side == 3)
    { // front
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[3][idx][k];
                    faces[3][idx][k] = faces[5][N - 1 - idx][N - 1 - k];
                    faces[5][N - 1 - idx][N - 1 - k] = faces[1][N - 1 - idx][N - 1 - k];
                    faces[1][N - 1 - idx][N - 1 - k] = faces[4][idx][N - 1 - k];
                    faces[4][idx][N - 1 - k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[3][idx][k];
                    faces[3][idx][k] = faces[4][idx][N - 1 - k];
                    faces[4][idx][N - 1 - k] = faces[1][N - 1 - idx][N - 1 - k];
                    faces[1][N - 1 - idx][N - 1 - k] = faces[5][N - 1 - idx][N - 1 - k];
                    faces[5][N - 1 - idx][N - 1 - k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[3][k][idx];
                    faces[3][k][idx] = faces[2][N - 1][N - 1 - k];
                    faces[2][N - 1][N - 1 - k] = faces[1][N - 1 - k][N - 1];
                    faces[1][N - 1 - k][N - 1] = faces[0][0][N - 1 - k];
                    faces[0][0][N - 1 - k] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[3][k][idx];
                    faces[3][k][idx] = faces[0][0][N - 1 - k];
                    faces[0][0][N - 1 - k] = faces[1][N - 1 - k][N - 1];
                    faces[1][N - 1 - k][N - 1] = faces[2][N - 1][N - 1 - k];
                    faces[2][N - 1][N - 1 - k] = temp;
                }
            }
        }
    }
    else if (side == 2)
    { // top
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[2][idx][k];
                    faces[2][idx][k] = faces[5][idx][N - 1 - k];
                    faces[5][idx][N - 1 - k] = faces[0][N - 1 - idx][k];
                    faces[0][N - 1 - idx][k] = faces[4][idx][k];
                    faces[4][idx][k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[2][idx][k];
                    faces[2][idx][k] = faces[4][idx][k];
                    faces[4][idx][k] = faces[0][N - 1 - idx][k];
                    faces[0][N - 1 - idx][k] = faces[5][idx][N - 1 - k];
                    faces[5][idx][N - 1 - k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[2][k][idx];
                    faces[2][k][idx] = faces[1][k][N - 1];
                    faces[1][k][N - 1] = faces[0][N - 1 - k][N - 1 - idx];
                    faces[0][N - 1 - k][N - 1 - idx] = faces[3][N - 1 - k][idx];
                    faces[3][N - 1 - k][idx] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[2][k][idx];
                    faces[2][k][idx] = faces[3][N - 1 - k][idx];
                    faces[3][N - 1 - k][idx] = faces[0][N - 1 - k][N - 1 - idx];
                    faces[0][N - 1 - k][N - 1 - idx] = faces[1][k][N - 1];
                    faces[1][k][N - 1] = temp;
                }
            }
        }
    }
    else if (side == 0)
    { // base
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[0][idx][k];
                    faces[0][idx][k] = faces[4][N - 1 - idx][k];
                    faces[4][N - 1 - idx][k] = faces[2][N - 1 - idx][N - 1 - k];
                    faces[2][N - 1 - idx][N - 1 - k] = faces[5][N - 1 - idx][N - 1 - k];
                    faces[5][N - 1 - idx][N - 1 - k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[0][idx][k];
                    faces[0][idx][k] = faces[5][N - 1 - idx][N - 1 - k];
                    faces[5][N - 1 - idx][N - 1 - k] = faces[2][N - 1 - idx][N - 1 - k];
                    faces[2][N - 1 - idx][N - 1 - k] = faces[4][N - 1 - idx][k];
                    faces[4][N - 1 - idx][k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[0][k][idx];
                    faces[0][k][idx] = faces[1][N - 1 - k][N - 1 - idx];
                    faces[1][N - 1 - k][N - 1 - idx] = faces[3][N - 1 - k][idx];
                    faces[3][N - 1 - k][idx] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[0][k][idx];
                    faces[0][k][idx] = faces[3][N - 1 - k][idx];
                    faces[3][N - 1 - k][idx] = faces[1][N - 1 - k][N - 1 - idx];
                    faces[1][N - 1 - k][N - 1 - idx] = temp;
                }
            }
        }
    }
    else if (side == 1)
    { // back
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[1][idx][k];
                    faces[1][idx][k] = faces[4][N - 1 - idx][N - 1 - k];
                    faces[4][N - 1 - idx][N - 1 - k] = faces[2][N - 1 - idx][k];
                    faces[2][N - 1 - idx][k] = faces[5][N - 1 - idx][k];
                    faces[5][N - 1 - idx][k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[1][idx][k];
                    faces[1][idx][k] = faces[5][N - 1 - idx][k];
                    faces[5][N - 1 - idx][k] = faces[2][N - 1 - idx][k];
                    faces[2][N - 1 - idx][k] = faces[4][N - 1 - idx][N - 1 - k];
                    faces[4][N - 1 - idx][N - 1 - k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[1][k][idx];
                    faces[1][k][idx] = faces[2][N - 1][N - 1 - k];
                    faces[2][N - 1][N - 1 - k] = faces[3][k][idx];
                    faces[3][k][idx] = faces[0][0][N - 1 - k];
                    faces[0][0][N - 1 - k] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[1][k][idx];
                    faces[1][k][idx] = faces[0][0][N - 1 - k];
                    faces[0][0][N - 1 - k] = faces[3][k][idx];
                    faces[3][k][idx] = faces[2][N - 1][N - 1 - k];
                    faces[2][N - 1][N - 1 - k] = temp;
                }
            }
        }
    }
    else if (side == 4)
    { // left
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[4][idx][k];
                    faces[4][idx][k] = faces[1][N - 1 - idx][k];
                    faces[1][N - 1 - idx][k] = faces[2][idx][N - 1 - k];
                    faces[2][idx][N - 1 - k] = faces[3][idx][k];
                    faces[3][idx][k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[4][idx][k];
                    faces[4][idx][k] = faces[3][idx][k];
                    faces[3][idx][k] = faces[2][idx][N - 1 - k];
                    faces[2][idx][N - 1 - k] = faces[1][N - 1 - idx][k];
                    faces[1][N - 1 - idx][k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[4][k][idx];
                    faces[4][k][idx] = faces[2][N - 1 - k][idx];
                    faces[2][N - 1 - k][idx] = faces[5][N - 1 - k][idx];
                    faces[5][N - 1 - k][idx] = faces[0][N - 1 - k][N - 1 - idx];
                    faces[0][N - 1 - k][N - 1 - idx] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[4][k][idx];
                    faces[4][k][idx] = faces[0][N - 1 - k][N - 1 - idx];
                    faces[0][N - 1 - k][N - 1 - idx] = faces[5][N - 1 - k][idx];
                    faces[5][N - 1 - k][idx] = faces[2][N - 1 - k][idx];
                    faces[2][N - 1 - k][idx] = temp;
                }
            }
        }
    }
    else if (side == 5)
    { // right
        if (is_row)
        {
            if (left_up)
            { // left
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[5][idx][k];
                    faces[5][idx][k] = faces[3][idx][N - 1 - k];
                    faces[3][idx][N - 1 - k] = faces[2][idx][k];
                    faces[2][idx][k] = faces[1][N - 1 - idx][N - 1 - k];
                    faces[1][N - 1 - idx][N - 1 - k] = temp;
                }
            }
            else
            { // right
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[5][idx][k];
                    faces[5][idx][k] = faces[1][N - 1 - idx][N - 1 - k];
                    faces[1][N - 1 - idx][N - 1 - k] = faces[2][idx][k];
                    faces[2][idx][k] = faces[3][idx][N - 1 - k];
                    faces[3][idx][N - 1 - k] = temp;
                }
            }
        }
        else
        { // col
            if (left_up)
            { // up
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[5][k][idx];
                    faces[5][k][idx] = faces[0][N - 1 - k][idx];
                    faces[0][N - 1 - k][idx] = faces[4][N - 1 - k][N - 1 - idx];
                    faces[4][N - 1 - k][N - 1 - idx] = faces[2][N - 1 - k][N - 1 - idx];
                    faces[2][N - 1 - k][N - 1 - idx] = temp;
                }
            }
            else
            { // down
                for (int k = 0; k < N; k++)
                {
                    char temp = faces[5][k][idx];
                    faces[5][k][idx] = faces[2][N - 1 - k][N - 1 - idx];
                    faces[2][N - 1 - k][N - 1 - idx] = faces[4][N - 1 - k][N - 1 - idx];
                    faces[4][N - 1 - k][N - 1 - idx] = faces[0][N - 1 - k][idx];
                    faces[0][N - 1 - k][idx] = temp;
                }
            }
        }
    }
}

void apply(string instr)
{
    if (instr == "turn left")
        turn_left();
    else if (instr == "turn right")
        turn_right();
    else if (instr == "rotate front")
        rotate_front();
    else if (instr == "rotate back")
        rotate_back();
    else if (instr == "rotate left")
        rotate_left();
    else if (instr == "rotate right")
        rotate_right();
    else
    {
        stringstream ss(instr);
        string side, num, dir;
        ss >> side >> num >> dir;
        int s = (side == "base") ? 0 : (side == "back") ? 1
                                   : (side == "top")    ? 2
                                   : (side == "front")  ? 3
                                   : (side == "left")   ? 4
                                                        : 5;
        int n = stoi(num) - 1;
        bool is_row = (dir == "left" || dir == "right");
        bool left_up = (dir == "left" || dir == "up");
        rotate_layer(s, is_row, n, left_up);
    }
}

bool is_uniform(int f)
{
    char c = faces[f][0][0];
    for (int i = 0; i < N; i++)
        for (int j = 0; j < N; j++)
            if (faces[f][i][j] != c)
                return false;
    return true;
}

int main()
{
    int K;
    cin >> N >> K;
    for (int i = 0; i < 6; i++)
    {
        faces[i].resize(N);
        for (int j = 0; j < N; j++)
        {
            cin >> faces[i][j];
        }
    }
    vector<string> instrs(K);
    for (int i = 0; i < K; i++)
        cin >> instrs[i];
    string answer = "Not Possible";
    for (int skip = 0; skip < K; skip++)
    {
        vector<string> orig[6];
        for (int i = 0; i < 6; i++)
            orig[i] = faces[i];
        for (int i = 0; i < K; i++)
            if (i != skip)
                apply(instrs[i]);
        bool solved = false;
        int solved_face = -1;
        for (int f = 0; f < 6; f++)
            if (is_uniform(f))
            {
                solved = true;
                solved_face = f;
                break;
            }
        if (solved)
        {
            char center = orig[solved_face][N / 2][N / 2];
            char uniform_c = faces[solved_face][0][0];
            if (uniform_c == center)
            {
                answer = instrs[skip];
            }
            else
            {
                answer = "Faulty\n" + instrs[skip];
            }
            break;
        }
        for (int i = 0; i < 6; i++)
            faces[i] = orig[i];
    }
    cout << answer << endl;
    return 0;
}
